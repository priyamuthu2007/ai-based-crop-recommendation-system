import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from src.inference import predict_crop


class TestInference(unittest.TestCase):
    def setUp(self):
        from src import inference

        inference._load_training_ranges.cache_clear()

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
        self.assertEqual(len(result["recommendations"]), 3)
        self.assertEqual(len(result["reasons"]), 3)
        self.assertTrue(all(result["crop"] in reason for reason in result["reasons"]))
        self.assertEqual(result["recommendations"][0]["crop"], result["crop"])
        self.assertEqual(
            result["confidence"], result["recommendations"][0]["match_score"]
        )
        self.assertEqual(
            sorted(
                (item["match_score"] for item in result["recommendations"]),
                reverse=True,
            ),
            [item["match_score"] for item in result["recommendations"]],
        )
        self.assertIsInstance(result["crop"], str)
        self.assertGreaterEqual(result["confidence"], 0)
        self.assertLessEqual(result["confidence"], 100)
        self.assertIn("out_of_training_range", result)
        self.assertEqual(result["out_of_training_range"], [])

    def test_rejects_non_finite_and_physically_invalid_inputs(self):
        base = {
            "nitrogen": 90,
            "phosphorus": 42,
            "potassium": 43,
            "temperature": 20.9,
            "humidity": 82,
            "ph": 6.5,
            "rainfall": 203,
        }
        for feature, value, expected in (
            ("nitrogen", float("nan"), "finite number"),
            ("humidity", 101, "Humidity must be between 0 and 100"),
            ("ph", -0.1, "Soil pH must be between 0 and 14"),
            ("temperature", float("inf"), "finite number"),
        ):
            with self.subTest(feature=feature, value=value):
                payload = {**base, feature: value}
                with self.assertRaisesRegex(ValueError, expected):
                    predict_crop(payload)

    def test_reports_values_outside_training_data_range(self):
        payload = {
            "nitrogen": 180,
            "phosphorus": 42,
            "potassium": 43,
            "temperature": 20.9,
            "humidity": 82,
            "ph": 6.5,
            "rainfall": 203,
        }

        result = predict_crop(payload)

        self.assertEqual(
            result["out_of_training_range"],
            [
                {
                    "feature": "Nitrogen",
                    "value": 180.0,
                    "minimum": 0.0,
                    "maximum": 140.0,
                }
            ],
        )


if __name__ == "__main__":
    unittest.main()
