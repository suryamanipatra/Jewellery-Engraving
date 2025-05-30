# Backend Dockerfile

FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend code
COPY backend .

# Expose port (assuming FastAPI or Flask on 8000)
EXPOSE 5000

# Run the backend server (update if using Flask or another framework)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
