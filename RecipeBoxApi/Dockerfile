
# Build the .NET 10 application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore "RecipeBoxApi.csproj"

RUN dotnet publish "RecipeBoxApi.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore

# Run the application
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
RUN apt-get update && \
    apt-get install -y --no-install-recommends libgssapi-krb5-2 && \
    rm -rf /var/lib/apt/lists/*
    
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "RecipeBoxApi.dll"]
