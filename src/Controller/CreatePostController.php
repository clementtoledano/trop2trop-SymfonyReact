<?php

namespace App\Controller;


use App\Entity\Post;
use App\Entity\User;
use DateTime;
use Symfony\Component\Security\Core\Security;

class CreatePostController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function __invoke(Post $data): Post
    {
        $data->setIsActive(true);
        $data->setCreateAt(new DateTime());
        /** @var User $theUser */
        $theUser = $this->security->getUser();
        $data->setUser($theUser);
        return $data;
    }
}
