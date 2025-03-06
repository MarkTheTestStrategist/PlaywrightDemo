# PlaywrightDemo
A simple set of tests in JavaScript.

# Tests
## Dynamic Content
This uses the [Herokuapp.com](https://the-internet.herokuapp.com/dynamic_content?with_content=static) website as the test site. 

Within this test file, we check:

- Title and header are present
- Text across the page is present
- There are always three images
- The images are dynamic, but should always have a url value as defined in a constants file.
- Links are present
- Links have the correct urls
- The value of the first two rows paragraphs are always the same on each click of "click here"
- The third row image and text changes with each click of the "click here" link.
- The third row is always >50 chars in length

---
