USE [master]
GO
/****** Object:  Database [litho-prae-db]    Script Date: 6/26/2021 3:59:03 PM ******/
CREATE DATABASE [litho-prae-db]
 CONTAINMENT = NONE
 ON  PRIMARY
( NAME = N'litho-prae-db', FILENAME = N'D:\SQL Server 2019\MSSQL15.SQLEXPRESS\MSSQL\DATA\litho-prae-db.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON
( NAME = N'litho-prae-db_log', FILENAME = N'D:\SQL Server 2019\MSSQL15.SQLEXPRESS\MSSQL\DATA\litho-prae-db_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [litho-prae-db] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [litho-prae-db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [litho-prae-db] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [litho-prae-db] SET ANSI_NULLS OFF
GO
ALTER DATABASE [litho-prae-db] SET ANSI_PADDING OFF
GO
ALTER DATABASE [litho-prae-db] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [litho-prae-db] SET ARITHABORT OFF
GO
ALTER DATABASE [litho-prae-db] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [litho-prae-db] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [litho-prae-db] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [litho-prae-db] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [litho-prae-db] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [litho-prae-db] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [litho-prae-db] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [litho-prae-db] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [litho-prae-db] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [litho-prae-db] SET  DISABLE_BROKER
GO
ALTER DATABASE [litho-prae-db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [litho-prae-db] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [litho-prae-db] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [litho-prae-db] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [litho-prae-db] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [litho-prae-db] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [litho-prae-db] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [litho-prae-db] SET RECOVERY SIMPLE
GO
ALTER DATABASE [litho-prae-db] SET  MULTI_USER
GO
ALTER DATABASE [litho-prae-db] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [litho-prae-db] SET DB_CHAINING OFF
GO
ALTER DATABASE [litho-prae-db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF )
GO
ALTER DATABASE [litho-prae-db] SET TARGET_RECOVERY_TIME = 60 SECONDS
GO
ALTER DATABASE [litho-prae-db] SET DELAYED_DURABILITY = DISABLED
GO
ALTER DATABASE [litho-prae-db] SET ACCELERATED_DATABASE_RECOVERY = OFF
GO
ALTER DATABASE [litho-prae-db] SET QUERY_STORE = OFF
GO
USE [litho-prae-db]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[First_name] [nvarchar](50) NOT NULL,
	[Last_name] [nvarchar](50) NOT NULL,
	[Username] [varchar](25) NOT NULL,
	[Email] [varchar](320) NOT NULL,
	[Passwd_Hash] [varbinary](100) NOT NULL,
	[Salt] [varchar](60) NOT NULL,
	[RoleId] [tinyint] NOT NULL,
	[Status] [tinyint] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Users_Email] UNIQUE NONCLUSTERED
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Users_Username] UNIQUE NONCLUSTERED
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Articles]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Articles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](100) NOT NULL,
	[Content] [nvarchar](4000) NOT NULL,
	[AuthorId] [int] NOT NULL,
	[CreatedAt] [datetime2](0) NOT NULL,
	[UpdatedAt] [datetime2](0) NOT NULL,
	[LastModifiedById] [int] NOT NULL,
 CONSTRAINT [PK_Articles] PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vAllArticles]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   VIEW [dbo].[vAllArticles]
AS
SELECT a.Id, a.Title, a.Content, a.CreatedAt, a.AuthorId,
	u.First_name, u.Last_name, u.Email
FROM Articles a
INNER JOIN Users u
ON
a.AuthorId = u.Id
GO
/****** Object:  View [dbo].[GetCommentsForArticle]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   VIEW [dbo].[GetCommentsForArticle]
AS
SELECT a.Id, a.Title, a.Content, a.CreatedAt, a.AuthorId, u.First_name, u.Last_name
	FROM Articles a
INNER JOIN
Users u
ON
a.AuthorId = u.Id
GO
/****** Object:  Table [dbo].[Comments]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ArticleId] [int] NOT NULL,
	[AuthorId] [int] NOT NULL,
	[CreatedAt] [datetime2](0) NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Comments] PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vGetCommentsForArticle]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   VIEW [dbo].[vGetCommentsForArticle]
AS
SELECT c.ArticleId, c.AuthorId, u.First_name, u.Last_name, c.CreatedAt, c.Content
	FROM Comments c
INNER JOIN
Users u
ON
c.AuthorId = u.Id
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [tinyint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](25) NOT NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tags]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tags](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_Tags] PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TagsArticles]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TagsArticles](
	[TagId] [int] NOT NULL,
	[ArticleId] [int] NOT NULL,
 CONSTRAINT [PK_TagsArticles] PRIMARY KEY CLUSTERED
(
	[TagId] ASC,
	[ArticleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_Articles]    Script Date: 6/26/2021 3:59:03 PM ******/
CREATE NONCLUSTERED INDEX [IX_Articles] ON [dbo].[Articles]
(
	[CreatedAt] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_RoleId]  DEFAULT ((1)) FOR [RoleId]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_Status]  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[Articles]  WITH CHECK ADD  CONSTRAINT [FK_Articles_Users_Author] FOREIGN KEY([AuthorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Articles] CHECK CONSTRAINT [FK_Articles_Users_Author]
GO
ALTER TABLE [dbo].[Articles]  WITH CHECK ADD  CONSTRAINT [FK_Articles_Users_LastModifiedBy] FOREIGN KEY([LastModifiedById])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Articles] CHECK CONSTRAINT [FK_Articles_Users_LastModifiedBy]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Articles] FOREIGN KEY([ArticleId])
REFERENCES [dbo].[Articles] ([Id])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Articles]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Users] FOREIGN KEY([AuthorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Users]
GO
ALTER TABLE [dbo].[TagsArticles]  WITH CHECK ADD  CONSTRAINT [FK_TagsArticles_Articles] FOREIGN KEY([ArticleId])
REFERENCES [dbo].[Articles] ([Id])
GO
ALTER TABLE [dbo].[TagsArticles] CHECK CONSTRAINT [FK_TagsArticles_Articles]
GO
ALTER TABLE [dbo].[TagsArticles]  WITH CHECK ADD  CONSTRAINT [FK_TagsArticles_Tags] FOREIGN KEY([TagId])
REFERENCES [dbo].[Tags] ([Id])
GO
ALTER TABLE [dbo].[TagsArticles] CHECK CONSTRAINT [FK_TagsArticles_Tags]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [CK_Users_Email] CHECK  (([Email] like '[a-z]%_@__%.__%'))
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [CK_Users_Email]
GO
/****** Object:  StoredProcedure [dbo].[CommentOnArticle]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CommentOnArticle]
@Comment nvarchar(MAX),
@ArticleId int,
@AuthorId int
AS

INSERT INTO [dbo].[Comments]
	(ArticleId, AuthorId, CreatedAt, Content)
VALUES(@ArticleId, @AuthorId, GETDATE(), @Comment)
GO
/****** Object:  StoredProcedure [dbo].[CreateNewArticle]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CreateNewArticle]
@Title nvarchar(100),
@Content nvarchar(4000),
@AuthorId int,
@CreatedAt datetime2(0)

AS

INSERT INTO [dbo].[Articles]
		(Title, Content, AuthorId, CreatedAt, UpdatedAt, LastModifiedById)
VALUES	(@Title, @Content, @AuthorId, @CreatedAt, @CreatedAt, @AuthorId)
GO
/****** Object:  StoredProcedure [dbo].[DeleteArticle]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[DeleteArticle]
@Id int
AS

DELETE FROM [dbo].[Articles]
	WHERE Id = @Id
GO
/****** Object:  StoredProcedure [dbo].[DeleteComment]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[DeleteComment]
@Id int

AS

DELETE FROM [dbo].[Comments]
	WHERE Id = @Id
GO
/****** Object:  StoredProcedure [dbo].[RegisterAUser]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[RegisterAUser]

@FirstName nvarchar(50),
@LastName nvarchar(50),
@Username varchar(25),
@Email varchar(320),
@Password varchar(50),
@Status tinyint

AS

DECLARE @Seed int;
DECLARE @COUNTER_CHARACTERS tinyint;
DECLARE @CTime DATETIME;
DECLARE @Salt varchar(50)
SET @CTime = GETDATE()
SET @COUNTER_CHARACTERS = 1
--hh -> hours
--n -> minutes
--s -> seconds
--ms -> miliseconds
SET @Seed = (DATEPART(hh, @Ctime) * 10000000) + (DATEPART(n, @CTime) * 100000)
			+ (DATEPART(s, @CTime) * 1000) + DATEPART(ms, @CTime);

--RAND() -> always returns the same seed for the same parameter given
--CHAR() -> returns the ascii character representation of an int ascii code
SET @Salt = CHAR(ROUND((RAND(@Seed) * 77.0) + 32, 3));

WHILE (@COUNTER_CHARACTERS < 50)
	BEGIN
		SET @Salt = @Salt + CHAR(ROUND((RAND() * 77.0) + 32, 3));
		SET @COUNTER_CHARACTERS = @COUNTER_CHARACTERS + 1;
	END


INSERT INTO [litho-prae-db].[dbo].[Users]

(First_name, Last_name, Username, Email, Passwd_Hash, Salt, [Status])

VALUES(@FirstName, @LastName, @Username, @Email, HASHBYTES('SHA2_512', @Password + @Salt), @Salt, @Status)
GO
/****** Object:  StoredProcedure [dbo].[UpdateArticle]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[UpdateArticle]
@Id int,
@Title nvarchar(100),
@Content nvarchar(4000)

AS

UPDATE [dbo].[Articles]
	SET Title = @Title, Content = @Content, UpdatedAt = GETDATE()
WHERE Id = @Id
GO
/****** Object:  StoredProcedure [dbo].[VerifyLogin]    Script Date: 6/26/2021 3:59:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[VerifyLogin]

@Username varchar(25),
@Password varchar(50),
@IsVerified int OUTPUT,
@RoleId tinyint OUTPUT,
@Status tinyint OUTPUT

AS

DECLARE @Salt varchar(50);
DECLARE @PasswordWithSalt varbinary(100);

SELECT @Salt = Salt, @PasswordWithSalt = Passwd_Hash, @IsVerified = Id, @RoleId = RoleId, @Status = Status
	FROM [dbo].[Users]
WHERE Username = @Username;

IF CONVERT(varbinary(100), HASHBYTES('SHA2_512', @Password + @Salt)) <> @PasswordWithSalt
	SET @IsVerified = 0
GO
USE [master]
GO
ALTER DATABASE [litho-prae-db] SET  READ_WRITE
GO
