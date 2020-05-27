<a name="2.3.0"></a>
## 2.3.0 (2020-05-27)

Updates:

- Use Collection.countDocuments() instead of deprecated Collection.count()
- Update package dev dependencies
- Update eslint and codebase to match new configs
- Update tests


<a name="2.1.1"></a>
## 2.1.1 (2018-10-28)

Fix error:
```
First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.
```
It happens if any connection argument comes as `null`. This is what Relay's **refetchConnection** from **PaginationContainer** does in order to refetch connection from scratch.


<a name="2.1.0"></a>
## 2.1.0 (2016-07-31)

This release gets rid of Babel and corrects an error in the previous release. Sorry about this!


<a name="2.0.0"></a>
## 2.0.0 (2016-07-22)


#### Features

* **mongoose:** Add support for Mongoose (#2). Thanks, [papigers](https://github.com/papigers)!


<a name="1.0.0"></a>
## 1.0.0 (2015-11-16)


#### Features

* **base64:** Add functions `base64()` and `unbase64()` ((676d11e7))
* **lib:**
  * Optionally use a mapper function when resolving ((8c9a642b))
  * Export `connectionFromMongoCursor` as default ((e2bb4d49))
