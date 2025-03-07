# School Management API

This project is a Node.js API for managing school data. The system allows users to add new schools and retrieve a list of schools sorted by proximity to a specified user location. It is built using Node.js, Express.js, and MongoDB (via Mongoose).

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [Add School (POST /addSchool)](#add-school)
  - [List Schools (GET /listSchools)](#list-schools)
- [Testing](#testing)
- [Deployment](#deployment)
- [Postman Collection](#postman-collection)
- [License](#license)

## Features

- **Add School API:**  
  Add new school details including name, address, latitude, and longitude.
  
- **List Schools API:**  
  Retrieve a list of schools sorted by distance from the user's given location using the Haversine formula for distance calculation.

## Project Structure

