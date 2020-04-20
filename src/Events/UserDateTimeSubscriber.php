<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class UserDateTimeSubscriber implements EventSubscriberInterface
{


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>
                ['setDateTimeForUser', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setDateTimeForUser(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();


        if ($user instanceof User && $method === 'POST' && $user->getCreateAt() === null) {
            $user->setCreateAt(new DateTime());
        }
        if ($user instanceof User && $method === 'PUT') {
            $user->setUpdateAt(new DateTime());
        }
    }
}
