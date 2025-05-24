FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AcCrm.Api/AcCrm.Api.csproj", "AcCrm.Api/"]
RUN dotnet restore "AcCrm.Api/AcCrm.Api.csproj"
COPY . .
WORKDIR "/src/AcCrm.Api"
RUN dotnet build "AcCrm.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AcCrm.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Install dotnet-watch for hot reload in development
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS development
WORKDIR /app
COPY ["AcCrm.Api/AcCrm.Api.csproj", "AcCrm.Api/"]
RUN dotnet restore "AcCrm.Api/AcCrm.Api.csproj"
COPY . .
WORKDIR "/app/AcCrm.Api"
ENTRYPOINT ["dotnet", "run", "--urls", "http://0.0.0.0:5000"] 