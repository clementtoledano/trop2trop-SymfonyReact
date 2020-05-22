<?php

namespace App\Controller;


use App\Entity\Post;
use DateTime;

class EditPostController
{

    public function __invoke(Post $data): Post
    {
        $data->setUpdateAt(new DateTime());

        return $data;
    }
}
