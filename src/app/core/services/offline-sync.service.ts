import { Injectable } from '@angular/core';
import localforage from 'localforage';
import { ApiService } from './api.service';
import { lastValueFrom } from 'rxjs';

interface QueueItem {
  id?: string;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: any;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class OfflineSyncService {
  private STORE = 'ifn_offline_queue';

  constructor(private api: ApiService) {
    localforage.config({ name: 'ifn_app' });
    window.addEventListener('online', () => {
      this.syncQueue();
    });
  }

  async push(item: QueueItem) {
    const queue: QueueItem[] = (await localforage.getItem(this.STORE)) || [];
    queue.push({ ...item, createdAt: Date.now() });
    await localforage.setItem(this.STORE, queue);
  }

  async getQueue(): Promise<QueueItem[]> {
    return (await localforage.getItem(this.STORE)) || [];
  }

  async clearQueue() {
    await localforage.setItem(this.STORE, []);
  }

  async syncQueue() {
    const queue = await this.getQueue();
    if (!navigator.onLine || !queue.length) return;
    for (const item of queue) {
      try {
        if (item.method === 'POST') {
          await lastValueFrom(this.api.post(item.url, item.body));
        } else if (item.method === 'PUT') {
          await lastValueFrom(this.api.put(item.url, item.body));
        } else if (item.method === 'DELETE') {
          await lastValueFrom(this.api.delete(item.url));
        }
      } catch (e) {
        console.error('Sync failed for item', item, e);
        // dejar el item para reintentos
      }
    }
    await this.clearQueue();
  }
}
