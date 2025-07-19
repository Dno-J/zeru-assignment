# 🔮 Zeru – Historical Token Price Oracle with Interpolation Engine

**Assignment Title:** Problem Statement 3 – Full Stack (Next.js + Node.js + Redis)  
**Live Frontend:** [https://zeru-assignment-three.vercel.app](https://zeru-assignment-three.vercel.app)

This app allows users to fetch historical token prices at a given timestamp, and if unavailable, generates interpolated values using surrounding price data. It also provides a scheduler that retrieves daily prices from token creation to present using BullMQ.

---

## 🛠️ Tech Stack

| Layer        | Technology               | Role & Reasoning                               |
|--------------|--------------------------|------------------------------------------------|
| Frontend     | **Next.js + Tailwind**   | Responsive form, server-rendered UI            |
| State        | **Zustand** *(optional)* | Price loading & fetch state management         |
| Backend API  | **Express.js**           | REST endpoints (`/price`, `/schedule`)         |
| Queue        | **BullMQ**               | Schedules historical price fetch jobs          |
| Cache        | **Redis (5m TTL)**       | Fast price lookups for recent timestamps       |
| Database     | **MongoDB**              | Persistent token price storage                 |
| Web3 Access  | **Alchemy SDK**          | Token metadata, transfer history, price lookup |

---

## 🌐 Frontend Features

- Form for `tokenAddress`, `network` (Ethereum/Polygon), `timestamp`
- Displays:
  - 🔹 Exact historical price
  - 🔹 Interpolated price (if exact not found)
  - 🔹 Source label: `cache`, `alchemy`, or `interpolated`
- Button: **Schedule Full History**
  - Triggers backend job to fetch daily prices from token creation

---

## 🧑‍💻 Backend Endpoints

### 📍 `GET /price`

```json
Request Body:
{
  "token": "0xA0b869...", 
  "network": "ethereum",
  "timestamp": 1678901234
}

Response:
{
  "price": 0.9998,
  "source": "cache" | "alchemy" | "interpolated"
}
```

- Attempts to retrieve cached price
- If unavailable, queries Alchemy
- If exact price missing, runs interpolation engine

---

### 🕘 `POST /schedule`

```json
Request Body:
{
  "token": "0x1f9840...",
  "network": "polygon"
}
```

- Detects token birth date using:
  ```js
  const firstTx = await alchemy.core.getAssetTransfers({ 
    contractAddress: token, 
    order: "asc", 
    maxCount: 1 
  });
  const creationDate = firstTx.transfers[0].blockTimestamp;
  ```
- Schedules daily price fetch jobs from `creationDate` → today
- Stores results in MongoDB for future reference

---

## 🧮 Interpolation Algorithm

If exact timestamp is unavailable:

```python
def interpolate(ts_q, ts_before, price_before, ts_after, price_after):
  ratio = (ts_q - ts_before) / (ts_after - ts_before)
  return price_before + (price_after - price_before) * ratio
```

This ensures timestamps between known price points yield weighted interpolated values.

---

## 🧪 Testing

Test Case 1 – Exact Match:
```bash
curl -X GET -H "Content-Type: application/json" \
  -d '{"token":"0xA0b869...c2d6","network":"ethereum","timestamp":1678901234}' \
  http://localhost:5000/price
```

Test Case 2 – Interpolation (e.g. weekend):
```bash
curl -X GET -H "Content-Type: application/json" \
  -d '{"token":"0x1f9840...85d5","network":"polygon","timestamp":1679032800}' \
  http://localhost:5000/price
```

---

## 📦 Environment Setup

### `.env.example` (Backend)

```bash
PORT=5000
MONGO_URI=your-mongo-uri
REDIS_URL=your-redis-uri
ALCHEMY_API_KEY=your-alchemy-api-key
```

### `NEXT_PUBLIC_API_URL` (Frontend – Vercel)

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## 📁 Repo Structure

```
zeru-assignment/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── worker.js
│   ├── server.js
│   └── ...
├── frontend/
│   ├── app/page.tsx
│   ├── styles/
│   └── ...
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Deployment Notes

- ✅ Frontend deployed to Vercel → [Live link](https://zeru-assignment-three.vercel.app)
- 🔜 Backend ready for Render/Railway deployment
- Alchemy rate limit handling via **p-retry** and exponential backoff
- BullMQ jobs survive restarts via Redis persistence

---

## 🧠 Evaluation Criteria Checklist

| Requirement                           | Status |
|--------------------------------------|--------|
| ✅ Correct interpolation formula      | ✔️     |
| ✅ BullMQ worker with persistence     | ✔️     |
| ✅ Alchemy 429 error handling         | ✔️     |
| ❌ No hardcoded token creation dates | ✔️     |
| ❌ No shallow interpolation fallback | ✔️     |
