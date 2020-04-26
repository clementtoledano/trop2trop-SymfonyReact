<?php

namespace App\DataFixtures;

use App\Entity\Hashtag;
use App\Entity\Image;
use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;

use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');
        $hashTagsArray = ["aide", "chef", "enfant", "garde", "gauche", "geste", "gosse", "livre", "merci", "mort", "ombre", "part", "poche", "professeur", "tour", "fois", "madame", "paix", "voix", "affaire", "année", "arme", "armée", "attention", "balle", "boîte", "bouche", "carte", "cause", "chambre", "chance", "chose", "classe", "confiance", "couleur", "cour", "cuisine", "dame", "dent", "droite", "école", "église", "envie", "épaule", "époque", "équipe", "erreur", "espèce", "face", "façon", "faim", "famille", "faute", "femme", "fenêtre", "fête", "fille", "fleur", "force", "forme", "guerre", "gueule", "habitude", "heure", "histoire", "idée", "image", "impression", "jambe", "joie", "journée", "langue", "lettre", "lèvre", "ligne", "lumière", "main", "maison", "maman", "manière", "marche", "merde", "mère", "minute", "musique", "nuit", "odeur", "oreille", "parole", "partie", "peau", "peine", "pensée", "personne", "peur", "photo", "pièce", "pierre", "place", "police", "porte", "présence", "prison", "putain", "question", "raison", "réponse", "robe", "route", "salle", "scène", "seconde", "sécurité", "semaine", "situation", "soeur", "soirée", "sorte", "suite", "table", "terre", "tête", "vérité", "ville", "voiture", "avis", "bois", "bras", "choix", "corps", "cours", "gars", "mois", "pays", "prix", "propos", "sens", "temps", "travers", "vieux", "accord", "agent", "amour", "appel", "arbre", "argent", "avenir", "avion", "bateau", "bébé", "besoin", "bonheur", "bonjour", "bord", "boulot", "bout", "bruit", "bureau", "café", "camp", "capitaine", "chat", "chemin", "chéri", "cheval", "cheveu", "chien", "ciel", "client", "cœur", "coin", "colonel", "compte", "copain", "côté", "coup", "courant", "début", "départ", "dieu", "docteur", "doigt", "dollar", "doute", "droit", "effet", "endroit", "ennemi", "escalier", "esprit", "état", "être", "exemple", "fait", "film", "flic", "fond", "français", "frère", "front", "garçon", "général", "genre", "goût", "gouvernement", "grand", "groupe", "haut", "homme", "honneur", "hôtel", "instant", "intérêt", "intérieur", "jardin", "jour", "journal", "lieu", "long", "maître", "mari", "mariage", "matin", "médecin", "mètre", "milieu", "million", "moment", "monde", "monsieur", "mouvement", "moyen", "noir", "nouveau", "numéro", "oeil", "oiseau", "oncle", "ordre", "papa", "papier", "parent", "passage", "passé", "patron", "père", "petit", "peuple", "pied", "plaisir", "plan", "point", "pouvoir", "premier", "présent", "président", "prince", "problème", "quartier", "rapport", "regard", "reste", "retard", "retour", "rêve", "revoir", "salut", "sang", "secret", "seigneur", "sentiment", "service", "seul", "siècle", "signe", "silence", "soir", "soldat", "soleil", "sourire", "souvenir", "sujet", "téléphone", "tout", "train", "travail", "trou", "truc", "type", "vent", "ventre", "verre", "village", "visage", "voyage", "fils", "gens"];
        foreach ($hashTagsArray as $data) {
            $hashtags = new Hashtag();
            $hashtags->setName($data);
            $manager->persist($hashtags);
            $manager->flush();
        }

        for ($i = 0; $i < 50; $i++) {
            $user = new User();
            $user->setName($faker->userName);
            $user->setEmail($faker->email);
            $user->setIsAdmin(false);
            $user->setIsActive(true);
            $user->setCreateAt($faker->dateTimeBetween($startDate = '-1 years', $endDate = 'now', $timezone = null));
            $password = $this->encoder->encodePassword($user, 'azeqsdaze');
            $user->setPassword($password);

            $manager->persist($user);

            for ($p = 0, $pMax = random_int(1, 10); $p < $pMax; $p++) {

                $post = new Post();
                $post->setUser($user);
                $post->setContent($faker->realText($maxNbChars = 140, $indexSize = 2));
                $post->setCreateAt($faker->dateTimeBetween($startDate = $user->getCreateAt(), $endDate = 'now', $timezone = null));
                $post->setIsActive(true);
                $theHashtags = $manager->getRepository(Hashtag::class)->findAll();
                $count = 0;
                while ($count < 4) {
                    $post->addHashtag($theHashtags[random_int(0, count($theHashtags)-1)]);
                    $count++;
                }

                $image = new Image($faker->userName . '.png', 'https://loremflickr.com/6' . random_int(10, 99) . '/3' . random_int(10, 99) . '/cat');
                $manager->persist($image);
                $post->setImage($image);
                $manager->persist($post);
            }
        }
        $manager->flush();

        $posts = $manager->getRepository(Post::class)->findAll();

        foreach ($posts as $post) {
            $users = $manager->getRepository(User::class)->findAll();

            foreach ($users as $user) {


                switch (random_int(1, 4)) {
                    case 1 :
                        $post->addFeelingBored($user);
                        break;
                    case 2 :
                        $post->addFeelingAngry($user);
                        break;
                    case 3 :
                        $post->addFeelingScary($user);
                        break;
                    case 4 :
                        $post->addFeelingSilly($user);
                        break;

                }
            }
        }
        $manager->flush();


    }
}
