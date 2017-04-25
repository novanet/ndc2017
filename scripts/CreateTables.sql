USE [NDC]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Emotions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PhotoId] [uniqueidentifier] NOT NULL,
	[Anger] [decimal](15, 14) NOT NULL,
	[Contempt] [decimal](15, 14) NOT NULL,
	[Disgust] [decimal](15, 14) NOT NULL,
	[Fear] [decimal](15, 14) NOT NULL,
	[Happiness] [decimal](15, 14) NOT NULL,
	[Neutral] [decimal](15, 14) NOT NULL,
	[Sadness] [decimal](15, 14) NOT NULL,
	[Surprise] [decimal](15, 14) NOT NULL,
	[Added] [datetime] NOT NULL,
 CONSTRAINT [PK_EmotionsForPhoto] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

CREATE TABLE [dbo].[Photo](
	[Id] [uniqueidentifier] NOT NULL,
	[BlobUri] [varchar](200) NOT NULL,
	[UserId] [int] NOT NULL,	
 CONSTRAINT [PK_Photo] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Email] [varchar](100) NULL,
	[Company] [varchar](100) NULL,
	[TwitterHandle] [varchar](100) NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO


