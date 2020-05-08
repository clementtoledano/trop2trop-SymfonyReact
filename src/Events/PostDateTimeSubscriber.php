<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Post;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class PostDateTimeSubscriber implements EventSubscriberInterface
{


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>
                ['setDateTimeForPost', EventPriorities::PRE_WRITE]
        ];

    }

    public function setDateTimeForPost(ViewEvent $event): void
    {
        $post = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($post instanceof Post && $method === 'POST' && $post->getCreateAt() === null) {
            $post->setCreateAt(new DateTime());
        }
        if ($post instanceof Post && $method === 'PUT') {
            $post->setUpdateAt(new DateTime());
        }
    }

}
