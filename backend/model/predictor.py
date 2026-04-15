import cv2
import numpy as np
import os

from ultralytics import YOLO
from huggingface_hub import hf_hub_download
from dotenv import load_dotenv

from model.config import *

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

model_path = hf_hub_download(
    repo_id="DigvijayPatel23/roadside-hazard-model",
    filename="best.pt",
    token=HF_TOKEN
)

model = YOLO(model_path)

def get_class_indices(model):
    names = {v.lower(): k for k, v in model.names.items()}
    return names.get('pole', 0), names.get('tree', 1)

def focal_length_px(h, vfov):
    return (h / 2) / np.tan(np.radians(vfov) / 2)

def robust_mask_extremes(pts):
    top_y = np.percentile(pts[:, 1], 2)
    base_y = np.percentile(pts[:, 1], 98)
    top = tuple(pts[np.argmin(abs(pts[:, 1] - top_y))].astype(int))
    base = tuple(pts[np.argmin(abs(pts[:, 1] - base_y))].astype(int))
    return top, base, abs(base_y - top_y)

def distance_to_pole(px_h, focal):
    if px_h < 5:
        return None
    return (REAL_POLE_HEIGHT_M * focal) / px_h

def run_audit(img):
    h, w, _ = img.shape
    results = model(img)[0]

    POLE_CLS, TREE_CLS = get_class_indices(model)
    focal = focal_length_px(h, CAMERA_VFOV_DEG)
    horizon = h * 0.47

    all_poles, all_trees, targets, hazards_log = [], [], [], []

    if results.masks is not None:
        for i, mask in enumerate(results.masks.xy):
            cls = int(results.boxes.cls[i])
            bbox = results.boxes.xyxy[i].cpu().numpy().astype(int)

            pts = mask.astype(np.float32)
            if len(pts) < 3:
                continue

            top, base, px_h = robust_mask_extremes(pts)

            data = {
                "top": top,
                "base": base,
                "px_h": px_h,
                "mask": pts.astype(np.int32),
                "bbox": bbox
            }

            if cls == POLE_CLS:
                all_poles.append(data)
            elif cls == TREE_CLS:
                all_trees.append(data)

    if all_poles:
        closest = max(all_poles, key=lambda x: x['base'][1])
        left = closest['base'][0] < w / 2

        if left:
            targets = [p for p in all_poles if p['base'][0] < w/2 + SIDE_BUFFER_PX]
        else:
            targets = [p for p in all_poles if p['base'][0] > w/2 - SIDE_BUFFER_PX]

        targets.sort(key=lambda x: x['px_h'], reverse=True)

    for i, p in enumerate(targets):
        d = distance_to_pole(p['px_h'], focal)
        label = f"P{i+1} ({int(d)}m)" if d else f"P{i+1}"

        cv2.rectangle(img, tuple(p['bbox'][:2]), tuple(p['bbox'][2:]), (255,120,0), 2)
        cv2.putText(img, label, (p['bbox'][0], p['bbox'][1]-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,120,0), 2)

    for i, tree in enumerate(all_trees):
        hazard = False
        reasons = []

        if targets:
            cp = min(targets, key=lambda p: np.linalg.norm(
                np.array(p['base']) - np.array(tree['base'])
            ))

            if tree['top'][1] < cp['top'][1]:
                hazard = True
                reasons.append("HEIGHT")

            if np.linalg.norm(np.array(cp['base']) - np.array(tree['base'])) < POLE_PROXIMITY_THRESHOLD_PX:
                hazard = True
                reasons.append("NEAR POLE")

        x_min, x_max = np.min(tree['mask'][:,0]), np.max(tree['mask'][:,0])

        if (tree['base'][1] > horizon and
            x_min < w*CANOPY_ROAD_LEFT_RATIO and
            x_max > w*CANOPY_ROAD_RIGHT_RATIO):
            hazard = True
            reasons.append("CANOPY")

        if hazard:
            color = (0,0,255)
            hazards_log.append({"tree": f"T{i+1}", "reasons": reasons})
            label = f"HAZARD: {' & '.join(reasons)}"
        else:
            color = (0,200,0)
            label = f"TREE {i+1}"

        cv2.rectangle(img, tuple(tree['bbox'][:2]), tuple(tree['bbox'][2:]), color, 2)
        cv2.putText(img, label, (tree['bbox'][0], tree['bbox'][1]-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    return img, {
        "poles": len(targets),
        "trees": len(all_trees),
        "hazards": len(hazards_log),
        "hazards_log": hazards_log
    }