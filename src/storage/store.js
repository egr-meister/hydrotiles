// Defensive AsyncStorage wrapper. Never throws to callers.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY, defaultAppData, mergeAppData } from './defaults';

// Load app data from device storage, merging with defaults.
// Handles empty storage, missing fields, and corrupted JSON.
export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return mergeAppData(defaultAppData);
    }
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (jsonError) {
      // Corrupted JSON -> fall back safely.
      return mergeAppData(defaultAppData);
    }
    return mergeAppData(parsed);
  } catch (error) {
    // Any storage failure -> safe defaults.
    return mergeAppData(defaultAppData);
  }
}

// Persist app data. Returns true on success, false on failure.
export async function saveAppData(data) {
  try {
    const safe = mergeAppData(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return true;
  } catch (error) {
    return false;
  }
}

// Completely clear stored data.
export async function clearAppData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}
