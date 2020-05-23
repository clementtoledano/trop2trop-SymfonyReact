<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;

use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class UserSubscriber implements EventSubscriberInterface
{


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>
                ['setUserBasics', EventPriorities::PRE_VALIDATE],
        ];
    }


    public function setUserBasics(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();


        if ($user instanceof User && $method === 'POST' && $user->getIsActive() === null) {
            $user->setIsActive(true);
        }
    }
}
