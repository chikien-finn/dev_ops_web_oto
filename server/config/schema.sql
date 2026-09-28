-- ========================================================
-- DATABASE SCHEMA: db_web_oto (AutoPremium Car Dealership)
-- Hệ thống bán ô tô trực tuyến và quản trị lái thử
-- ========================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'db_web_oto')
BEGIN
    CREATE DATABASE db_web_oto;
END
GO

USE db_web_oto;
GO

-- 1. BẢNG NGƯỜI DÙNG (Users)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id NVARCHAR(100) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        phone NVARCHAR(20),
        address NVARCHAR(255),
        role NVARCHAR(20) DEFAULT 'user', -- 'admin' hoặc 'user'
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME
    );
END
GO

-- 2. BẢNG KHO XE (Cars)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cars' AND xtype='U')
BEGIN
    CREATE TABLE Cars (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        price FLOAT NOT NULL,
        year INT NOT NULL,
        type NVARCHAR(50) NOT NULL, -- Sedan, SUV, Coupe...
        fuel NVARCHAR(50) NOT NULL, -- Gasoline, Electric, Hybrid...
        image NVARCHAR(500),
        specsJson NVARCHAR(MAX),    -- Lưu trữ JSON thông số gia tốc, động cơ, tính năng
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME
    );
END
GO

-- 3. BẢNG ĐĂNG KÝ LÁI THỬ & TƯ VẤN (Bookings)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Bookings' AND xtype='U')
BEGIN
    CREATE TABLE Bookings (
        id NVARCHAR(100) PRIMARY KEY,
        carId INT,
        carName NVARCHAR(150),
        name NVARCHAR(100) NOT NULL,
        phone NVARCHAR(20) NOT NULL,
        date NVARCHAR(50),
        location NVARCHAR(50) DEFAULT 'showroom', -- 'showroom' hoặc 'home'
        note NVARCHAR(MAX),
        status NVARCHAR(30) DEFAULT 'pending',   -- 'pending', 'contacted', 'completed', 'cancelled'
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME
    );
END
GO

-- 4. BẢNG XE YÊU THÍCH (Favorites)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Favorites' AND xtype='U')
BEGIN
    CREATE TABLE Favorites (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId NVARCHAR(100) NOT NULL,
        carId INT NOT NULL,
        createdAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT UQ_User_Car UNIQUE (userId, carId)
    );
END
GO
