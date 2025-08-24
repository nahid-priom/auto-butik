# Car Lookup API Documentation

## Overview
The Car Lookup API provides two main functionalities:
1. **Car Search by Registration Number** - Get complete vehicle data using license plate
2. **Dropdown Car Selection** - Progressive dropdown system for brand → year → model → type → wheel specifications

Base URL: `http://localhost:3000`

## Authentication
All endpoints are publicly accessible. Authentication is handled internally by the backend service.

---

## 1. Car Search by Registration Number

### Endpoint
```
GET /car/{regNr}
```

### Description
Retrieve complete vehicle information using a Swedish registration number.

### Parameters
- `regNr` (path parameter): Swedish registration number in format `ABC123` or `ABC12D`

### Example Request
```javascript
const response = await fetch('http://localhost:3000/car/UTB678');
const data = await response.json();
```

### Example Response
```json
{
  "success": true,
  "regNr": "UTB678",
  "data": {
    "RegNr": "UTB678",
    "modell_id": "18027",
    "Chassinummer": "KMHBU51HP4U174142",
    "C_vaxellada": "MANUELL",
    "WHEELID": "40001309",
    "Fordons_ar": "2003",
    "C_merke": "HYUNDAI",
    "C_modell": "GETZ",
    "C_typ": "1.3",
    "C_kw": "63",
    "C_hk": "85",
    "C_slagvolym": "1341",
    "C_lit": "1.3",
    "C_cylinder": "4",
    "C_hjuldrift": "FRAMHJULSDRIFT",
    "C_bransle": "BENSIN",
    "C_kaross": "HALVKOMBI",
    "C_motorkod": "G4EA",
    "C_chassi": "[TB]",
    "C_fran_ar": "2003/09",
    "C_till_ar": "2005/09",
    "Min_Tum": "13",
    "Max_Tum": "18",
    "BULTCIRKEL": "4-100",
    "BULTDIMETER": "12x1,5M",
    "NAVHAL": "54,1 mm",
    "ET": "46 mm",
    "dack_dim_fram": "155/80R13,165/65R14,175/65R14,185/55R15,195/50R15,195/45R16,205/45R16,205/40R17,215/35R18",
    "dack_dim_bak": "",
    "Bredd_Fram": "5/7,5",
    "Bredd_Bak": "5/7,5",
    "ET_fram_tollerans": "35/50",
    "ET_bak_tollerans": "35/50",
    "Dackdimension_fram": "175/65R1482T",
    "Dackdimension_bak": "175/65R1482T",
    "Falgdimension_fram": "5.0JX14/ET46",
    "Falgdimension_bak": "5.0JX14/ET46",
    "type": "success"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Car not found",
  "message": "No vehicle found for registration number: ABC123"
}
```

---

## 2. Dropdown Car Selection System

The dropdown system follows a 5-step progressive selection process:

### Step 1: Get All Brands

#### Endpoint
```
GET /car/dropdown/brands
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/car/dropdown/brands');
const data = await response.json();
```

#### Example Response
```json
{
  "success": true,
  "data": [
    "ABARTH", "ACURA", "AIWAYS", "ALFA ROMEO", "ALPINA", "ALPINE",
    "BMW", "FORD", "HYUNDAI", "MERCEDES-BENZ", "TOYOTA", "VOLKSWAGEN",
    // ... 113 total brands
  ]
}
```

### Step 2: Get Years for Selected Brand

#### Endpoint
```
POST /car/dropdown/years
```

#### Request Body
```json
{
  "merke": "BMW"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/car/dropdown/years', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ merke: 'BMW' })
});
const data = await response.json();
```

#### Example Response
```json
{
  "success": true,
  "brand": "BMW",
  "data": [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970, 1969, 1968, 1967, 1966, 1965, 1964, 1963, 1962, 1961, 1960, 1959, 1958, 1957, 1956, 1955, 1954, 1953, 1952]
}
```

### Step 3: Get Models for Selected Brand + Year

#### Endpoint
```
POST /car/dropdown/models
```

#### Request Body
```json
{
  "merke": "BMW",
  "year": "2020"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/car/dropdown/models', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ merke: 'BMW', year: '2020' })
});
const data = await response.json();
```

#### Example Response
```json
{
  "success": true,
  "brand": "BMW",
  "year": "2020",
  "data": [
    "1-SERIE", "2-SERIE", "3-SERIE", "4-SERIE", "5-SERIE", "6-SERIE",
    "7-SERIE", "8-SERIE", "i3", "i8", "iX3", "X1", "X2", "X3", "X4",
    "X5", "X6", "X7", "Z4"
  ]
}
```

### Step 4: Get Types for Selected Brand + Year + Model

#### Endpoint
```
POST /car/dropdown/types
```

#### Request Body
```json
{
  "merke": "BMW",
  "year": "2020",
  "modell": "3-SERIE"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/car/dropdown/types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
    merke: 'BMW', 
    year: '2020', 
    modell: '3-SERIE' 
  })
});
const data = await response.json();
```

#### Example Response
```json
{
  "success": true,
  "brand": "BMW",
  "year": "2020",
  "model": "3-SERIE",
  "data": {
    "133248": "330 i SEDAN [G20] (190 kW)",
    "133249": "320 d SEDAN [G20] (140 kW)",
    "133250": "320 d xDrive SEDAN [G20] (140 kW)",
    "134016": "M 340 i xDrive SEDAN [G20, G80, G28] (275 kW)",
    "135053": "320 i SEDAN [G20] (135 kW)",
    "135058": "318 d SEDAN [G20] (110 kW)",
    // ... more types with model IDs as keys
  }
}
```

### Step 5: Get Wheel Specifications for Selected Type

#### Endpoint
```
POST /car/dropdown/wheel-id
```

#### Request Body
```json
{
  "mid": "133248"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/car/dropdown/wheel-id', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ mid: '133248' })
});
const data = await response.json();
```

#### Example Response
```json
{
  "success": true,
  "modelId": "133248",
  "data": {
    "WHEELID": "40005046",
    "C_merke": "BMW",
    "C_modell": "3-SERIE",
    "C_typ": "330 i",
    "C_kw": "190",
    "C_chassi": "[G20]",
    "Ar_fran": "2018",
    "Ar_till": "2222",
    "Min_Tum": "17",
    "Max_Tum": "21",
    "BULTCIRKEL": "5-112",
    "BULTDIMETER": "14X1,25",
    "NAVHAL": "66,5 mm",
    "ET": "27 mm",
    "dack_dim_fram": "205/60R16,225/50R17,225/45R18,255/40R18,225/40R19,255/35R19,225/35R20,255/30R20,245/30R20,295/25R20,245/30R21,295/25R21",
    "dack_dim_bak": "(225/45R18,255/40R18),(225/40R19,255/35R19),(225/35R20,255/30R20),(245/30R20,295/25R20),(245/30R21,295/25R21)",
    "Bredd_Fram": "",
    "Bredd_Bak": "7,5/10",
    "ET_fram_tollerans": "24/38",
    "ET_bak_tollerans": "24/43",
    "DK_Anmarkning": "",
    "type": "success"
  }
}
```

---

## Implementation Guide

### React Implementation Example

```jsx
import React, { useState, useEffect } from 'react';

const CarSelector = () => {
  const [brands, setBrands] = useState([]);
  const [years, setYears] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState({});
  const [wheelData, setWheelData] = useState(null);
  
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/car/dropdown/brands');
      const data = await response.json();
      
      if (data.success) {
        setBrands(data.data);
      } else {
        setError('Failed to load brands');
      }
    } catch (err) {
      setError('Error loading brands: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadYears = async (brand) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/car/dropdown/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merke: brand })
      });
      const data = await response.json();
      
      if (data.success) {
        setYears(data.data);
        // Reset dependent selections
        setModels([]);
        setTypes({});
        setWheelData(null);
        setSelectedYear('');
        setSelectedModel('');
        setSelectedType('');
      }
    } catch (err) {
      setError('Error loading years: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async (brand, year) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/car/dropdown/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merke: brand, year: year })
      });
      const data = await response.json();
      
      if (data.success) {
        setModels(data.data);
        // Reset dependent selections
        setTypes({});
        setWheelData(null);
        setSelectedModel('');
        setSelectedType('');
      }
    } catch (err) {
      setError('Error loading models: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTypes = async (brand, year, model) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/car/dropdown/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merke: brand, year: year, modell: model })
      });
      const data = await response.json();
      
      if (data.success) {
        setTypes(data.data);
        // Reset dependent selections
        setWheelData(null);
        setSelectedType('');
      }
    } catch (err) {
      setError('Error loading types: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWheelData = async (modelId) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/car/dropdown/wheel-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mid: modelId })
      });
      const data = await response.json();
      
      if (data.success) {
        setWheelData(data.data);
      }
    } catch (err) {
      setError('Error loading wheel data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    if (brand) {
      loadYears(brand);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (year && selectedBrand) {
      loadModels(selectedBrand, year);
    }
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    if (model && selectedBrand && selectedYear) {
      loadTypes(selectedBrand, selectedYear, model);
    }
  };

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    if (typeId) {
      loadWheelData(typeId);
    }
  };

  return (
    <div className="car-selector">
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      
      {/* Brand Selector */}
      <select 
        value={selectedBrand} 
        onChange={(e) => handleBrandChange(e.target.value)}
        disabled={loading}
      >
        <option value="">Select Brand</option>
        {brands.map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>

      {/* Year Selector */}
      <select 
        value={selectedYear} 
        onChange={(e) => handleYearChange(e.target.value)}
        disabled={loading || !selectedBrand}
      >
        <option value="">Select Year</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      {/* Model Selector */}
      <select 
        value={selectedModel} 
        onChange={(e) => handleModelChange(e.target.value)}
        disabled={loading || !selectedYear}
      >
        <option value="">Select Model</option>
        {models.map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>

      {/* Type Selector */}
      <select 
        value={selectedType} 
        onChange={(e) => handleTypeChange(e.target.value)}
        disabled={loading || !selectedModel}
      >
        <option value="">Select Type</option>
        {Object.entries(types).map(([id, description]) => (
          <option key={id} value={id}>{description}</option>
        ))}
      </select>

      {/* Display Wheel Data */}
      {wheelData && (
        <div className="wheel-data">
          <h3>Wheel Specifications</h3>
          <p><strong>Wheel ID:</strong> {wheelData.WHEELID}</p>
          <p><strong>Bolt Pattern:</strong> {wheelData.BULTCIRKEL}</p>
          <p><strong>Center Bore:</strong> {wheelData.NAVHAL}</p>
          <p><strong>ET Offset:</strong> {wheelData.ET}</p>
          <p><strong>Rim Size Range:</strong> {wheelData.Min_Tum}" - {wheelData.Max_Tum}"</p>
          <p><strong>Front Tires:</strong> {wheelData.dack_dim_fram}</p>
          {wheelData.dack_dim_bak && (
            <p><strong>Rear Tires:</strong> {wheelData.dack_dim_bak}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CarSelector;
```

### Registration Number Search Example

```jsx
import React, { useState } from 'react';

const RegistrationSearch = () => {
  const [regNr, setRegNr] = useState('');
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchByRegistration = async () => {
    if (!regNr.trim()) {
      setError('Please enter a registration number');
      return;
    }

    // Validate format (ABC123 or ABC12D)
    const regPattern = /^[A-Z]{3}[0-9]{2}[0-9A-Z]$/;
    if (!regPattern.test(regNr.toUpperCase())) {
      setError('Invalid format. Use ABC123 or ABC12D format');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/car/${regNr.toUpperCase()}`);
      const data = await response.json();
      
      if (data.success) {
        setCarData(data.data);
      } else {
        setError(data.message || 'Car not found');
        setCarData(null);
      }
    } catch (err) {
      setError('Error searching for car: ' + err.message);
      setCarData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-search">
      <div className="search-input">
        <input
          type="text"
          value={regNr}
          onChange={(e) => setRegNr(e.target.value.toUpperCase())}
          placeholder="Enter registration number (e.g., ABC123)"
          maxLength={6}
          disabled={loading}
        />
        <button onClick={searchByRegistration} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {carData && (
        <div className="car-details">
          <h3>Vehicle Information</h3>
          <div className="basic-info">
            <p><strong>Registration:</strong> {carData.RegNr}</p>
            <p><strong>Brand:</strong> {carData.C_merke}</p>
            <p><strong>Model:</strong> {carData.C_modell}</p>
            <p><strong>Type:</strong> {carData.C_typ}</p>
            <p><strong>Year:</strong> {carData.Fordons_ar}</p>
            <p><strong>Engine:</strong> {carData.C_lit}L, {carData.C_hk} HP</p>
            <p><strong>Fuel:</strong> {carData.C_bransle}</p>
          </div>
          
          <div className="wheel-info">
            <h4>Wheel Specifications</h4>
            <p><strong>Wheel ID:</strong> {carData.WHEELID}</p>
            <p><strong>Bolt Pattern:</strong> {carData.BULTCIRKEL}</p>
            <p><strong>Center Bore:</strong> {carData.NAVHAL}</p>
            <p><strong>ET Offset:</strong> {carData.ET}</p>
            <p><strong>Rim Size:</strong> {carData.Min_Tum}" - {carData.Max_Tum}"</p>
            <p><strong>Front Tires:</strong> {carData.dack_dim_fram}</p>
            {carData.dack_dim_bak && (
              <p><strong>Rear Tires:</strong> {carData.dack_dim_bak}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationSearch;
```

---

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (car/data not found)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Best Practices
1. **Always check the `success` field** in responses
2. **Validate registration numbers** client-side before API calls
3. **Handle loading states** during API calls
4. **Reset dependent dropdowns** when parent selections change
5. **Implement proper error messaging** for users
6. **Cache dropdown data** when possible to reduce API calls

---

## Performance Considerations

- **Response Times**: ~1.1 seconds average
- **Rate Limiting**: No current limits, but implement reasonable debouncing
- **Caching**: Consider caching brand lists and frequently accessed data
- **Progressive Loading**: Load dropdowns progressively to improve UX

---

## Integration Notes

- All endpoints return Swedish vehicle data
- Registration numbers must be in Swedish format (ABC123 or ABC12D)
- Wheel specifications include both metric and imperial measurements
- Some vehicles may not have separate rear tire specifications
- Model IDs from the types endpoint are used for wheel specification lookup
