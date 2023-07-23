#!/usr/bin/env python3
"""
Write a function named index_range that
takes two integer arguments page and page_size.

The function should return a tuple of size two containing a
start index and an end index corresponding to the range of
indexes to return in a list for those particular pagination parameters

Page numbers are 1-indexed, i.e. the first page is page 1.
"""


def index_range(page, page_size):
    """
    return the indices of start and end element of a particular page
    """
    if page > 0:
        end = page * page_size
        start = end - page_size
        return start, end
    return 0, 0
