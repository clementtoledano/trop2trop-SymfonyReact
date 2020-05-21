<?php

namespace App\Controller;


use App\Entity\Hashtag;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;


class GetHashtagByName extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;


    /**
     * GetHashtagByName constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @Route("/api/hashtags/{tag}/findbyname",name="hashtag_by_name",methods={"GET"})
     */
    public function __invoke($tag)
    {
        $hashtag = $this->manager->getRepository(Hashtag::class)->findOneBy(['name' => $tag]);
        return new JsonResponse(['id' => $hashtag ? $hashtag->getId(): $hashtag]);

    }
}
