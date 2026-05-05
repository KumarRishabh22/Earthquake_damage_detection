import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import os

# Create output directory
os.makedirs("model", exist_ok=True)

# Build a simple CNN model for damage detection
model = keras.Sequential([
    layers.Input(shape=(224, 224, 3)),
    layers.Rescaling(1./255),
    layers.Conv2D(32, 3, activation='relu'),
    layers.MaxPooling2D(2),
    layers.Conv2D(64, 3, activation='relu'),
    layers.MaxPooling2D(2),
    layers.Conv2D(128, 3, activation='relu'),
    layers.MaxPooling2D(2),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')  # Binary classification: damaged or not
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

print("Model architecture:")
model.summary()

# Generate dummy training data to train the model
print("\nGenerating dummy training data...")
X_train = np.random.rand(100, 224, 224, 3)  # 100 random images
y_train = np.random.randint(0, 2, 100)  # Random labels (0 or 1)

# Train the model
print("Training model on dummy data...")
model.fit(X_train, y_train, epochs=2, batch_size=16, verbose=1)

# Save the model in HDF5 format
model_path = "model/model.h5"
print(f"\nSaving model to {model_path}...")
model.save(model_path)

print(f"✅ Model saved successfully at {model_path}")
print(f"Model file size: {os.path.getsize(model_path) / 1024 / 1024:.2f} MB")

# Verify the model can be loaded
print("\nVerifying model can be loaded...")
loaded_model = keras.models.load_model(model_path)
print("✅ Model loaded successfully!")

# Check the file signature
with open(model_path, "rb") as f:
    signature = f.read(8)
print(f"File signature: {signature}")
if signature == b"\x89HDF\r\n\x1a\n":
    print("✅ Valid HDF5 file!")
else:
    print(f"❌ Invalid HDF5 signature: {signature}")
