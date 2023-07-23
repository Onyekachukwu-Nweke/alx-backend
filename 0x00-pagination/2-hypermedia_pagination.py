#!/usr/bin/env python3
"""
Hypermedia pagination
"""
import csv
import math
from typing import List


def index_range(page, page_size):
    """
    return the indices of start and end element of a particular page
    """
    if page > 0:
        end = page * page_size
        start = end - page_size
        return start, end
    return 0, 0


class Server:
    """
    Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """
        Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        return elements in Popular_Baby_Names.csv corresponding to the
        page and page_size
        """
        elements = []
        try:
            assert page > 0
            assert page_size > 0
        except Exception:
            raise AssertionError

        try:
            all_element = self.dataset()
            start, end = index_range(page, page_size)

            for idx in range(start, end):
                elements.append(all_element[idx])
            # print(all_element[:12])
            return elements
        except IndexError:
            return []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """
        hypermedia pagination
        """
        all_elements = self.dataset()
        total_pages = math.ceil(len(all_elements) / page_size)

        if page >= total_pages:
            next_page = None
        elif page >= 1 and page < total_pages:
            next_page = page + 1
        if page <= 1:
            prev_page = None
        elif page > 1:
            prev_page = page - 1

        current_page_data = self.get_page(page, page_size)
        data = {
                'page_size': page_size,
                'page': page,
                'data': current_page_data,
                'next_page': next_page,
                'prev_page': prev_page,
                'total_pages': total_pages
                }
        return data
