<?php

namespace App\DataFixtures;

use App\Entity\Hashtag;
use App\Entity\MediaObject;
use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;

use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\HttpFoundation\File\UploadedFile;
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

        $user = new User();
        $user->setName('admin');
        $user->setEmail('admin@admin.admin');
        $user->setIsActive(true);
        $user->setCreateAt($faker->dateTimeBetween($startDate = '-1 years', $endDate = 'now', $timezone = null));
        $password = $this->encoder->encodePassword($user, 'adminadmin');
        $user->setPassword($password);
        $user->setRoles(['ROLE_ADMIN']);
        $manager->persist($user);

        $hashTagsArray = ["aide", "chef", "équipe", "chat", "erreur", "espèce", "face", "façon", "faim", "famille", "faute", "femme", "fenêtre", "fête", "fille", "fleur", "force", "forme", "guerre", "camp", "doute", "droit", "effet", "endroit", "ennemi", "escalier", "esprit", "état", "être", "exemple", "fait", "film", "flic", "fond", "reste"];
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
            $user->setIsActive(true);
            $user->setCreateAt($faker->dateTimeBetween($startDate = '-1 years', $endDate = 'now', $timezone = null));
            $password = $this->encoder->encodePassword($user, 'azeqsdaze');
            $user->setPassword($password);

            $manager->persist($user);

            for ($p = 0, $pMax = random_int(1, 10); $p < $pMax; $p++) {

                $post = new Post();
                $post->setUser($user);
                $post->setContent($faker->realText($maxNbChars = 88, $indexSize = 2));
                $post->setCreateAt($faker->dateTimeBetween($startDate = $user->getCreateAt(), $endDate = 'now', $timezone = null));
                $post->setIsActive(true);
                $theHashtags = $manager->getRepository(Hashtag::class)->findAll();
                $count = 0;
                while ($count < 4) {
                    $post->addHashtag($theHashtags[random_int(0, count($theHashtags) - 1)]);
                    $count++;
                }

                $src = "src/DataFixtures/fixture.gif";
                $newfile = "src/DataFixtures/fixxture.gif";

                copy($src, $newfile);
                $file = new UploadedFile(
                    $newfile,
                    'fixture.gif',
                    '	image/gif',
                    null,
                    true //  Set test mode true !!! " Local files are used in test mode hence the code should not enforce HTTP uploads."
                );
                $mediaObject = new MediaObject();
                $mediaObject->setFile($file);
                $manager->persist($mediaObject);

                $post->setImage($mediaObject);
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
