# flight-review-front

## 1. Présentation générale

L’application front-end a été développée en **Angular 19**.  
Elle permet de consommer les endpoints de l’API `flight-review-api`, un projet Spring Boot qui expose des avis sur les vols.  
Le projet a été généré avec Angular CLI via la commande suivante :

```bash
ng new flight-review-front
````

---

## 2. Structure du projet

L’architecture du front suit une organisation modulaire :

* `features/` : composants liés aux fonctionnalités comme l’accueil, la liste des avis, le formulaire d’ajout.
* `services/` : services Angular responsables des interactions avec l’API (ex : `ReviewService`, `FlightService`).
* `models/` : interfaces TypeScript représentant les données métier (comme `Review`).
* `environments/` : contient la configuration d’URL de l’API (`environment.ts`).

---

## 3. Fonctionnalités principales

### Accueil (`HomeComponent`)

* Page d’accueil contenant deux boutons :

  * Accès à la **liste des avis**
  * Accès au **formulaire de soumission**
* Une barre de navigation (Navbar) permet aussi de basculer entre les vues.

---

### Formulaire d’avis (`ReviewFormComponent`)

* Le formulaire est en **deux étapes** :

  1. **Identification du vol** (compagnie + numéro de vol)
  2. **Rédaction de l’avis** : note (1 à 5) + commentaire

* **Conditions :**

  * Le vol doit **déjà exister** dans la base (vérification via `FlightService`)
  * La recherche du vol est **non sensible à la casse ni aux espaces**

* **Soumission :**

  * Une notification (`MatSnackBar`) s’affiche à droite après validation
  * L’avis devient consultable dans la liste des avis

---

### Liste des avis (`ReviewListComponent`)

* Affichage des avis dans un tableau
* Fonctionnalités :

  * **Filtrage** par plusieurs critères
  * **Tri dynamique** sur les colonnes (asc/desc)
  * **Réinitialisation** rapide de tous les filtres
  * **Affichage complet** d’un commentaire via une boîte de dialogue (`MatDialog`)

---

## 4. Gestion des requêtes HTTP

Tous les appels HTTP sont gérés par des services dédiés :

* `ReviewService` :

  * Créer un avis
  * Récupérer les avis (avec ou sans filtres)
  * Obtenir le détail d’un avis

* `FlightService` :

  * Vérifier si un vol existe à partir de son numéro

Cela garantit une **bonne séparation des responsabilités**.

---

## 5. Démonstration

Une **vidéo de démonstration** est disponible sur Google Drive.
Elle montre :

* La soumission d’un avis
* La vérification d’un vol
* Le filtrage et tri des avis

https://drive.google.com/file/d/1dQJ1CYgg5vGW7gTfjcaHbX64TlIp4-SO/view?usp=sharing

---

## 6. Ressources utilisées

* [Documentation Angular Material](https://material.angular.io) : composants UI (tableaux, dialogues, snackbars, etc.)

