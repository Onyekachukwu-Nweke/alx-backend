#!/usr/bin/env python3
"""
Create a class LIFOCache that inherits from BaseCaching and is a
caching system:

You must use self.cache_data - dictionary from the parent class BaseCaching

You can overload def __init__(self):
but don’t forget to call the parent init: super().__init__()

def put(self, key, item):
    Must assign to the dictionary
    self.cache_data the item value for the key key.

    If key or item is None, this method should not do anything.

    If the number of items in self.cache_data is higher
    that BaseCaching.MAX_ITEMS:

    you must discard the last item put in cache (LFU algorithm)

    you must print DISCARD: with the key discarded and following by a new line

    def get(self, key):
    Must return the value in self.cache_data linked to key.
    If key is None or if the key doesn’t exist in self.cache_data,
    return None.
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    a simple LRU cache
    """

    def __init__(self):
        """instance initialization"""
        super().__init__()
        self.key_count = {}

    def put(self, key, item):
        """
        Must assign to the dictionary self.cache_data
        the item value for the key key.
        """
        if key and item:
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                lru = min(self.key_count, key=self.key_count.get)
                del self.key_count[lru]
                del self.cache_data[lru]
                print("DISCARD: {}".format(lru))
            if key in self.key_count:
                self.key_count[key] += 1
            else:
                self.key_count[key] = 0
            # self.cache_data[key] = item

    def get(self, key):
        """return a cached item"""
        if key in self.cache_data:
            self.key_count[key] += 1
        return self.cache_data.get(key)
