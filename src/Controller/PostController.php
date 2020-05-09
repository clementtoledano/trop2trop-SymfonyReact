<?php

namespace App\Controller;

use App\Entity\Hashtag;
use App\Entity\MediaObject;
use App\Entity\Post;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class PostController extends AbstractController
{

    /**
     * @Route("/api/posts", name="post-create", methods={"POST"})
     * @param Request $request
     * @param EntityManagerInterface $manager
     * @param Security $security
     */
    public function create(Request $request, EntityManagerInterface $manager, Security $security): ?JsonResponse
    {
        $thePost = json_decode($request->getContent(), true);

        try {
            $newPost = new Post();
            $newPost->setContent($thePost['content']);

            if (isset($thePost['hashtags'])) {
                $tags = $thePost['hashtags'];
                array_map(static function ($tag) use ($newPost, $manager) {
                    $theTag = $manager->getRepository(Hashtag::class)->findOneBy(['name' => $tag]);
                    if ($theTag === null) {
                        $theTag = new Hashtag();
                        $theTag->setName($tag);
                        $manager->persist($theTag);
                    }
                    $newPost->addHashtag($theTag);
                }, $tags);

            }
            /** @var MediaObject $theMediaObject */
            $theMediaObject = $manager->getRepository(MediaObject::class)->find((int)$thePost['image']);
            $newPost->setImage($theMediaObject);
            $newPost->setIsActive(true);
            $newPost->setCreateAt(new DateTime());
            /** @var User $theUser */
            $theUser = $security->getUser();
            $newPost->setUser($theUser);

            $manager->persist($newPost);
            $manager->flush();
            return new JsonResponse('{"message":"creation ok","status":"201"}', Response::HTTP_CREATED, [], true);
        } catch (Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_BAD_REQUEST, [], true);
        }

    }

    /**
     * @Route("/api/posts/{id}", name="post-edit", methods={"PUT"})
     * @param $id
     * @param Request $request
     * @param EntityManagerInterface $manager
     * @return JsonResponse|null
     */
    public function update($id, Request $request, EntityManagerInterface $manager): ?JsonResponse
    {
        $thePost = json_decode($request->getContent(), true);
        try {
            $oldPost = $manager->getRepository(Post::class)->find($id);
            if (isset($thePost['hashtags'])) {
                $theOldTags = $oldPost->getHashtags();
                foreach ($theOldTags as $oldTag) {
                    $oldPost->removeHashtag($oldTag);
                }
                $tags = $thePost['hashtags'];
                array_map(static function ($tag) use ($oldPost, $manager) {
                    if ($tag !== "") {
                        $theTag = $manager->getRepository(Hashtag::class)->findOneBy(['name' => $tag]);
                        if ($theTag === null) {
                            $theTag = new Hashtag();
                            $theTag->setName($tag);
                            $manager->persist($theTag);
                        }
                        $oldPost->addHashtag($theTag);
                    }
                }, $tags);
            }

            $oldPost->setUpdateAt(new DateTime());
            $oldPost->setContent($thePost['content']);
            $manager->persist($oldPost);
            $manager->flush();
            return new JsonResponse('{"message":"update ok","status":"201"}', Response::HTTP_CREATED, [], true);
        } catch (Exception $e) {
            return new JsonResponse($e->getMessage(), Response::HTTP_BAD_REQUEST, [], true);
        }
    }

}
