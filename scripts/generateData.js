/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const categories = ['flights', 'hotels', 'trains', 'buses', 'cabs'];
// How many items to generate per category
const count = 120;

const images = {
  flights: [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1556382226-28c9d8d11a20?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542296332-2e44a996aa0b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?auto=format&fit=crop&q=80&w=800'
  ],
  hotels: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'
  ],
  trains: [
    'https://images.unsplash.com/photo-1532305523713-5d1607149395?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1515165592879-0704e323b5f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1596825205489-9ddc07d58996?auto=format&fit=crop&q=80&w=800'
  ],
  buses: [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=800'
  ],
  cabs: [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800'
  ]
};

const titles = {
  flights: ['Indigo', 'Vistara', 'Air India', 'SpiceJet', 'Akasa Air'],
  hotels: ['The Oberoi', 'Taj Palace', 'Hyatt Regency', 'Marriott', 'Radisson Blu', 'Lemon Tree', 'ITC Grand'],
  trains: ['Vande Bharat', 'Rajdhani', 'Shatabdi', 'Duronto', 'Tejas Express'],
  buses: ['Volvo 9600', 'Scania Metrolink', 'Mercedes Benz', 'Bharat Benz', 'Tata Motors'],
  cabs: ['Sedan (Dzire)', 'SUV (Innova)', 'Luxury (Mercedes)', 'Hatchback (Swift)', 'Van (Tempo)']
};

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Goa', 'Jaipur', 'Udaipur'];

const hotelAreas = ['City Center', 'Old Town', 'Business District', 'Beachfront', 'Near Airport'];
const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First Class'];
const hotelRoomTypes = ['Standard Room', 'Deluxe Room', 'Suite', 'Family Room'];
const trainClasses = ['Sleeper', '3AC', '2AC', '1AC', 'Chair Car'];
const busTypes = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Semi-Sleeper'];

const generateRandomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateData = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  categories.forEach(category => {
    const items = [];
    for (let i = 1; i <= count; i++) {
      const from = getRandomItem(cities);
      let to = getRandomItem(cities);
      while (to === from) to = getRandomItem(cities);

      let title = '';
      let subtitle = '';
      let price = 0;
      let details = [];

      switch (category) {
        case 'flights': {
          const airline = getRandomItem(titles.flights);
          const cabin = getRandomItem(cabinClasses);
          title = `${airline} - ${from} to ${to}`;
          subtitle = `${cabin} • ${generateRandomPrice(1, 5)}h ${generateRandomPrice(0, 50)}m • Non-stop`;
          price = generateRandomPrice(3000, 20000);
          details = [cabin, `${generateRandomPrice(15, 25)}kg Baggage`, 'Free Meal', 'Free Cancellation*'];
          break;
        }
        case 'hotels': {
          const brand = getRandomItem(titles.hotels);
          const suffix = getRandomItem(['Grand', 'Plaza', 'Resort', 'Suites', 'Inn']);
          const area = getRandomItem(hotelAreas);
          const room = getRandomItem(hotelRoomTypes);
          title = `${brand} ${suffix}`;
          subtitle = `${to}, India • ${area}`;
          price = generateRandomPrice(2500, 50000);
          details = [room, 'Breakfast Included', 'Free WiFi', 'Pool Access'];
          break;
        }
        case 'trains': {
          const service = getRandomItem(titles.trains);
          const tClass = getRandomItem(trainClasses);
          title = `${service} Express`;
          subtitle = `${from} to ${to} • ${tClass}`;
          price = generateRandomPrice(500, 6000);
          details = [tClass, 'Meals Available', 'On-time Guarantee'];
          break;
        }
        case 'buses': {
          const busModel = getRandomItem(titles.buses);
          const busType = getRandomItem(busTypes);
          title = busModel;
          subtitle = `${from} to ${to} • ${busType}`;
          price = generateRandomPrice(600, 3500);
          details = [busType, 'Blanket', 'Charging Point', 'Water Bottle'];
          break;
        }
        case 'cabs': {
          const cabType = getRandomItem(titles.cabs);
          title = cabType;
          subtitle = `${from} to ${to} • Airport / Outstation`;
          price = generateRandomPrice(1200, 9000);
          details = ['AC', 'Clean Car', 'Verified Driver', 'Toll Included'];
          break;
        }
      }

      items.push({
        id: `${category.charAt(0)}${i}`,
        type: category.slice(0, -1), // remove 's'
        title,
        subtitle,
        price,
        rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
        image: getRandomItem(images[category]),
        details,
        // from/to used heavily in search & filtering on frontend
        from,
        to,
      });
    }

    fs.writeFileSync(path.join(dataDir, `${category}.json`), JSON.stringify(items, null, 2));
    console.log(`Generated ${count} items for ${category}`);
  });
};

generateData();
