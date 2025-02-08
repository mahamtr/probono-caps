# Build Angular production files
FROM node:lts AS client-build
WORKDIR /app
COPY caps-client/package.json caps-client/package-lock.json ./
RUN npm ci --quiet
COPY caps-client ./
RUN npm run build --prod

# .NET runtime base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# .NET SDK image for building the API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["caps/caps.csproj", "caps/"]
RUN dotnet restore "caps/caps.csproj"
WORKDIR "/src/caps"
COPY . .

RUN dotnet build "caps.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish .NET app
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "caps.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage: combine Angular and .NET
FROM base AS final
WORKDIR /app

# Copy the published .NET app
COPY --from=publish /app/publish .

# Copy the built Angular files to the wwwroot folder
#COPY --from=client-build /app/dist/caps-client /app/wwwroot

ENTRYPOINT ["dotnet", "caps-app.dll"]