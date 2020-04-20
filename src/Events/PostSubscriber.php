<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Post;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class PostSubscriber implements EventSubscriberInterface
{


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>
                ['setPostBasics', EventPriorities::PRE_VALIDATE]
        ];

    }


    public function setPostBasics(ViewEvent $event): void
    {
        $post = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();


        if ($post instanceof Post && $method === 'POST' && $post->getIsActive() === null) {
        $post->setIsActive(true);
        }
    }
}
