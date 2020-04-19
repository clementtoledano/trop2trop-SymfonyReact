<?php

namespace App\DataFixtures;

use App\Entity\Category;
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
        $categoryArray = ["Film", "Musique", "Humain", "Animaux", "Livre", "Life", "Travail"];
        foreach ($categoryArray as $data) {
            $category = new Category();
            $category->setName($data);
            $manager->persist($category);
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
                $theCategory = $manager->getRepository(Category::class)->findAll();
                $post->setCategory($theCategory[random_int(0, count($theCategory) - 1)]);

                $image = new Image($faker->userName . '.png', 'https://loremflickr.com/5'.random_int(10,99).'/5'.random_int(10,99).'/cat');
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
