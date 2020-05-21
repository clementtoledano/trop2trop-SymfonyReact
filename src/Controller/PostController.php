<?php

namespace App\Controller;

use App\Entity\Hashtag;
use App\Entity\Post;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PostController extends AbstractController
{


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
