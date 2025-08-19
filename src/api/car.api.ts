import { ICarApiResponse } from '~/interfaces/car';

// Get API base URL
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use BASE_PATH environment variable
    return process.env.BASE_PATH || 'http://localhost:3000';
  } else {
    // Client-side: use NEXT_PUBLIC_API_URL from next.config.js
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
};

export class CarApi {
  /**
   * Fetch car data by registration number
   * @param regNumber - Registration number (e.g., "PJZ 109")
   * @returns Promise with car data
   */
  async getCarByRegistration(regNumber: string): Promise<ICarApiResponse> {
    // Remove spaces and format the registration number
    const formattedRegNumber = regNumber.replace(/\s+/g, '');
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/car/${formattedRegNumber}`;

    console.log('Car API - Making request to:', url);
    console.log('Car API - Base URL:', baseUrl);
    console.log('Car API - Registration number:', formattedRegNumber);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add ngrok bypass header for ngrok tunnels
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        console.error('Car API - HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ICarApiResponse = await response.json();
      console.log('Car API - Response received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching car data:', error);
      throw error;
    }
  }
}

export const carApi = new CarApi();
