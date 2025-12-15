import sys, os, json
sys.path.insert(0, os.path.abspath('.'))
from utils.predictions import TabularPredictor
import numpy as np

print('=== Tabular Models Load Check ===')
try:
    predictor = TabularPredictor()
    print('Loaded models:', list(predictor.models.keys()))
    print('Total models:', len(predictor.models))
    dummy = np.array([[1.0]*30])
    preds = predictor.predict(dummy)
    import pprint; pprint.pprint(preds)
except Exception as e:
    import traceback
    print('ERROR:', e)
    traceback.print_exc()
