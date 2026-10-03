import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from src.inference import predict_crop


class TestInference(unittest.TestCase):
    def test_predict_crop_uses_model_and_returns_crop(self):
        payload = {
            "nitrogen": 90,
            "phosphorus": 42,
            "potassium": 43,
            "temperature": 20.9,
            "humidity": 82,
            "ph": 6.5,
            "rainfall": 203,
        }
        result = predict_crop(payload)
        self.assertIn("crop", result)
        self.assertIn("confidence", result)
        self.assertIsInstance(result["crop"], str)
        self.assertGreaterEqual(result["confidence"], 0)
        self.assertLessEqual(result["confidence"], 100)


if __name__ == "__main__":
    unittest.main()
