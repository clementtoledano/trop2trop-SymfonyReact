<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class FeelingController extends AbstractController
{

    /**
     * @Route("/api/feelings/{userId}", name="user-feeling", methods={"GET"})
     * @param $userId
     * @param EntityManagerInterface $manager
     * @param Security $security
     * @return JsonResponse|null
     */
    public function getPostFeelingByUser(EntityManagerInterface $manager, Security $security): ?JsonResponse
    {
        /** @var User $theUser */
        $theUser = $security->getUser();

        try {

            $feelingAngry = $manager->getRepository(Post::class)->getPostFeelingAngryByUser($theUser);
            $feelingBored = $manager->getRepository(Post::class)->getPostFeelingBoredByUser($theUser);
            $feelingSilly = $manager->getRepository(Post::class)->getPostFeelingSillyByUser($theUser);
            $feelingScary = $manager->getRepository(Post::class)->getPostFeelingScaryByUser($theUser);
            //TODO A OPTIMISER LOL !
            $feelings = [];
            foreach ($feelingAngry as $postId) {
                $feelings['feelingAngry'][] = $postId->getId();
            }
            foreach ($feelingBored as $postId) {
                $feelings['feelingBored'][] = $postId->getId();
            }
            foreach ($feelingSilly as $postId) {
                $feelings['feelingSilly'][] = $postId->getId();
            }
            foreach ($feelingScary as $postId) {
                $feelings['feelingScary'][] = $postId->getId();
            }

            return new JsonResponse($feelings, Response::HTTP_OK);
        } catch (Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_BAD_REQUEST, [], true);
        }
//        }
    }

    /**
     * @Route("/api/posts/{postId}/feelings", name="post-feeling", methods={"PUT"})
     * @param $postId
     * @param Request $request
     * @param EntityManagerInterface $manager
     * @param Security $security
     * @return JsonResponse|null
     */
    public
    function update($postId, Request $request, EntityManagerInterface $manager, Security $security): ?JsonResponse
    {
        $theRequest = json_decode($request->getContent(), true);
        /** @var User $theUser */
        $theUser = $security->getUser();
        try {
            $post = $manager->getRepository(Post::class)->find($postId);
            $post->removeFeelingBored($theUser);
            $post->removeFeelingAngry($theUser);
            $post->removeFeelingScary($theUser);
            $post->removeFeelingSilly($theUser);
            foreach ($theRequest as $key => $value) {
//                dump($key, $value);
                if ($value) {
                    switch ($key) {
                        case "angry" :
                            $post->addFeelingAngry($theUser);
                            $post->removeFeelingBored($theUser);
                            $post->removeFeelingScary($theUser);
                            $post->removeFeelingSilly($theUser);
                            break;
                        case "bored" :
                            $post->addFeelingBored($theUser);
                            $post->removeFeelingAngry($theUser);
                            $post->removeFeelingScary($theUser);
                            $post->removeFeelingSilly($theUser);
                            break;
                        case "silly" :
                            $post->addFeelingSilly($theUser);
                            $post->removeFeelingAngry($theUser);
                            $post->removeFeelingBored($theUser);
                            $post->removeFeelingScary($theUser);
                            break;
                        case "scared" :
                            $post->addFeelingScary($theUser);
                            $post->removeFeelingAngry($theUser);
                            $post->removeFeelingBored($theUser);
                            $post->removeFeelingSilly($theUser);
                            break;

                    }
                }
            }
            $manager->persist($post);
            $manager->flush();
            return new JsonResponse('{"message":"update ok","status":"201"}', Response::HTTP_CREATED, [], true);
        } catch (Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_BAD_REQUEST, [], true);
        }
    }

}
