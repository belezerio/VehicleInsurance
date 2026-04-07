# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY . .
RUN dotnet restore VehicleInsurance.API/VehicleInsurance.API.csproj
RUN dotnet publish VehicleInsurance.API/VehicleInsurance.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5000
ENTRYPOINT ["dotnet", "VehicleInsurance.API.dll"]