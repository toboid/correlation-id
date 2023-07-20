# Changelog

## 5.0.2 (14th July 2023)
- Bump semver from 6.3.0 to 6.3.1.

## 5.0.0 (27th November 2022)

- Drop support for node versions prior to 14
- Remove uuid so that module no longer has any prod depdencenies
- Update dev dev dependencies
- Include Typescript definitions

## 4.0.0 (16th November 2020)

Change implementation to AsyncLocalStorage, no change to public API however minimum supported node version is not v12.17.0

## 3.0.0 (8th July 2018)

`bindId` and `withId` now return the return value of the `work` function passed
to them as a parameter.
