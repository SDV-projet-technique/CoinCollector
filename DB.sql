CREATE TABLE CoinCollection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    annee INTEGER NOT NULL,
    rarete TEXT NOT NULL,
    quantite INTEGER NOT NULL,
    valeur TEXT
);

INSERT INTO CoinCollection (annee, rarete, quantite, valeur)
VALUES (2021, 'Rare', 10, '[1.5, 2.0, 2.5]');
INSERT INTO CoinCollection (annee, rarete, quantite, valeur)
VALUES (2022, 'Common', 20, '[1.0, 1.5]');

SELECT * FROM CoinCollection;
