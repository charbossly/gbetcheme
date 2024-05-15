Prerequisites
What things you need to install the software and how to install them

Python 3.6 or higher
FastAPI

pip install fastapi
Uvicorn (ASGI server)

pip install uvicorn

Installing

A step by step series of examples that tell you how to get a development environment running

Clone the repository

Navigate to the project directory


cd projectname

Install the required packages

pip install -r requirements.txt

Running the Project

To run the project, use the following command in your terminal:


uvicorn main:app --reload

This command tells Uvicorn to run the app object in main.py. The --reload option makes the server restart whenever you make changes to your code.

Once the server is running, you can access the application in your web browser at http://localhost:8000.

Built With
FastAPI - The web framework used
Uvicorn - ASGI server
Contributing


License
This project is licensed under the MIT License - see the LICENSE.md file for details
