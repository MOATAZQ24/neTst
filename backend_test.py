import requests
import sys
import json
from datetime import datetime

class CCNAAPITester:
    def __init__(self, base_url="https://networkprep.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_id = f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.tests_run = 0
        self.tests_passed = 0
        self.quiz_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response preview: {str(response_data)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )

    def test_get_questions(self):
        """Test getting all questions"""
        success, response = self.run_test(
            "Get All Questions",
            "GET", 
            "questions",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} questions")
            if len(response) > 0:
                print(f"   Sample question: {response[0].get('question_text', 'N/A')[:50]}...")
        return success, response

    def test_seed_questions(self):
        """Test seeding questions (optional)"""
        return self.run_test(
            "Seed Questions",
            "POST",
            "questions/seed", 
            200
        )

    def test_start_quiz(self):
        """Test starting a quiz"""
        quiz_config = {
            "difficulty_level": "beginner",
            "question_count": 5
        }
        success, response = self.run_test(
            "Start Quiz",
            "POST",
            "quiz/start",
            200,
            data=quiz_config
        )
        if success and 'id' in response:
            self.quiz_id = response['id']
            print(f"   Quiz ID: {self.quiz_id}")
            print(f"   Questions count: {len(response.get('questions', []))}")
        return success, response

    def test_submit_quiz(self):
        """Test submitting quiz answers"""
        if not self.quiz_id:
            print("❌ Cannot test quiz submission - no quiz ID available")
            return False, {}
            
        # Submit answers (assuming 5 questions, answering all as option 0)
        submission_data = {
            "session_id": self.session_id,
            "quiz_id": self.quiz_id,
            "answers": [0, 1, 2, 0, 1],  # Mix of answers
            "time_taken": 120  # 2 minutes
        }
        success, response = self.run_test(
            "Submit Quiz",
            "POST",
            "quiz/submit",
            200,
            data=submission_data
        )
        if success:
            print(f"   Score: {response.get('score', 'N/A')}%")
            print(f"   Correct answers: {response.get('correct_answers', 'N/A')}/{response.get('total_questions', 'N/A')}")
        return success, response

    def test_get_progress(self):
        """Test getting user progress"""
        success, response = self.run_test(
            "Get User Progress",
            "GET",
            f"progress/{self.session_id}",
            200
        )
        if success:
            print(f"   Total quizzes: {response.get('total_quizzes', 0)}")
            print(f"   Average score: {response.get('average_score', 0)}%")
        return success, response

    def test_get_leaderboard(self):
        """Test getting leaderboard"""
        success, response = self.run_test(
            "Get Leaderboard",
            "GET",
            "leaderboard",
            200
        )
        if success and isinstance(response, list):
            print(f"   Leaderboard entries: {len(response)}")
            if len(response) > 0:
                print(f"   Top performer: {response[0].get('average_score', 'N/A')}% avg score")
        return success, response

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🚀 Starting CCNA API Testing...")
        print(f"Base URL: {self.base_url}")
        print(f"Session ID: {self.session_id}")
        print("=" * 60)

        # Test sequence
        tests = [
            self.test_root_endpoint,
            self.test_seed_questions,  # Seed questions first
            self.test_get_questions,
            self.test_start_quiz,
            self.test_submit_quiz,
            self.test_get_progress,
            self.test_get_leaderboard
        ]

        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test failed with exception: {str(e)}")
                self.tests_run += 1

        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! Backend API is working correctly.")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed. Check the issues above.")
            return 1

def main():
    tester = CCNAAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())