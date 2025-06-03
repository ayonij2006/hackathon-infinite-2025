### Requirements
Python 3.12.10

### Steps to install and run the project
1. Install python version 3.12.10
2. Clone the project
3. Open project folder in VS Code
4. Open terminal
5. (optional) Create virtual environment
   - python -m venv myvenv (Create virtual environment)
   - Linux - source myvenv/bin/activate (Activate virtual environment)
   - Windows - myenv\Scripts\activate
6. Run command "pip install -r requirements.txt" (This will install all the requirements listed in requirements.txt)
7. To run the app "python -m uvicorn main:app --reload"

### Steps to install and run angular application
1. Install node version 22.15.1
2. Install angular version 20.0.0
3. cd ./frontend
4. Install dependencies
   - npm install --force
5. Run application
   - ng s