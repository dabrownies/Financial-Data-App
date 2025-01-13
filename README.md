# **Financial Hub**

## A Brief Overview

The Financial Data Filtering App is a web application designed to streamline the process of analyzing and filtering financial data. Users can input various criteria—such as date ranges, revenue thresholds, and net income parameters—and quickly filter a dataset to identify relevant financial insights.

The app features a Flask API backend for managing and serving data and a dynamic frontend interface that enables users to interact with the data seamlessly. This tool is ideal for begineer investors who want to process and review financial data efficiently. The app has several pointers and useful information to help newcomers understand technical terms.

Users have access to a robust front end platform powered by React and Next.js.
All data is fetched from external API endpoints and all filtered/sorted data is processed server-side using Flask.

## Technologies Used
- **JavaScript**: For building the front end and back end of the application.
- **Python**: Used for utility scripts and API handling.
- **Node.js**: Backend framework to handle server-side logic.
- **React**: For the interactive user interface.
- **Next.js**: Used for the front end of the platform.
- **Flask**: Handled data retrieval and served endpoints for robust backend support.
- **Railway**: Used to deploy and host Flask server externally.
- **Tailwind**: Used for dynamic styling in front end interface.
- **Shadcn/ui**: Provided UI components for user interaction.
- **Framer-Motion**: Used to create UI implementation.


## Directory Structure
### /.
Contains the main project in /financial-data-app and requirements.txt, Procfile, and server.py
for the Flask back-end server.
### /app
Defines all of the app's backend logic.
### /api
Handles the data fetching from the API endpoint.
### /components
Contains UI components.



## 📦 Installation and 🛠 Set Up
*Clone Repo*
```bash
git clone https://github.com/dabrownies/Financial-Data-App
cd financial-data-app
```

*Set Up Python Environment Using Conda*
```bash 
conda create -n <env name> python = 3.10
conda activate <env name> 
pip install "requirements.txt"
```

*If you don't have Conda you can simply set up with Python3*
```bash
python3 -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

*Install Python Dependencies*
```bash 
pip install flask flask-cors requests
```



*Set up npm env*
```bash
npm install
npm run build
```

*How to Get API Key*

To run the app, you'll need an API key for **Financial Modeling Prep**. Follow the steps below to obtain this key.

*Firstly, create a .env.local file in the frontend directory:*
```bash
touch .env.local
```

### How to Retrieve Financial Modeling Prep (FMP) API Key:

1. Go to ([https://site.financialmodelingprep.com/](https://site.financialmodelingprep.com)).
2. Click on **Sign Up** to create an account or log in.
3. Once you log in, if not already redirected, select **Dashboard** on the top right.
4. You should see your API Key under **API Keys**, if not, select **API Details** with a Key Icon on the left.
5. Create your key and **copy** it.
6. Insert these values into your `.env.local` file:
```bash
nano .env.local
# Add the following:
NEXT_PUBLIC_API_KEY=<your_api_key_here>
```

## Start the Flask Server:
```bash
python server.py
```
The server will run on ```http://localhost:5000```


## Update your .env.local File:
```bash
nano .env.local

#Add the following:
NEXT_PUBLIC_API_URL=http://localhost:5000
```
If you are using another port make sure you specify that in the code.


## How to Run Server 🚀
```bash
npm start
```
Use browser of choice to open
(localhost:3000)

## Navigating and Using the Web Interface

   1. The data will already be present and displayed on the table.
   2. Learn about the compnay you're researching. This gives a brief overview of the company's operations, location, CEO, employee count, etc.

   ![Learn About Company Screenshot](./public/images/LearnAboutCompany.png)

   3a. Format currency values for sleeker tables or more precise numbers. With Format ON, you can view large values in their original number for precise calculations.

   ![Format ON Screenshot](./public/images/FormatOn.png)

   3b. With Format OFF, you can keep large values in their truncated form (T for trillions, B for billions, M for millions) to have a cleaner table look.

   ![Format OFF Screenshot](./public/images/FormatOFF.png)

   4. Learn more about every table row header so you know exactly what you're looking at.

   ![Header Info Screenshot](./public/images/HeaderInfo.png)

   5. Filter your search. Specify which rows you want to display by specifying their value ranges, then click Apply to save those changes.

   ![Filter Screenshot](./public/images/Filter.png)

   6. Sort your table. Specify in which order and which values you want to sort, then click Apply to save those changes.

   ![Sort Screenshot](./public/images/Sort.png)


## Open Source License


Copyright <2024> <Adam Sadov>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
