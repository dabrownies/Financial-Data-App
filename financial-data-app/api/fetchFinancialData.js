// This file simply fetches the data from the specified endpoint 

const fetchFinancialData = async () => {
    const endpoint = `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching financial data:", error);
        return [];
    }
};

export default fetchFinancialData;
