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

    you must discard the last item put in cache (MRU algorithm)

    you must print DISCARD: with the key discarded and following by a new line

    def get(self, key):
    Must return the value in self.cache_data linked to key.
    If key is None or if the key doesn’t exist in self.cache_data,
    return None.
"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """
    a simple LRU cache
    """

    def __init__(self):
        """instance initialization"""
        super().__init__()
        self.key_order = []

    def put(self, key, item):
        """
        Must assign to the dictionary self.cache_data
        the item value for the key key.
        """
        if key and item:
            if key in self.cache_data:
                del self.cache_data[key]
                self.key_order.remove(key)
            if len(self.key_order) >= BaseCaching.MAX_ITEMS:
                discard = self.key_order.pop()
                del self.cache_data[discard]
                print("DISCARD: {}".format(discard))
            self.cache_data[key] = item
            self.key_order.append(key)

    def get(self, key):
        """return a cached item"""
        if key in self.cache_data:
            self.key_order.remove(key)
            self.key_order.append(key)
        return self.cache_data.get(key)
