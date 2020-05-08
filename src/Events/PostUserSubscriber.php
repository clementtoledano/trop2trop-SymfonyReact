<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Post;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class PostUserSubscriber implements EventSubscriberInterface
{
    /** @var Security */
    private $security;

    /**
     * CustomerUserSubscriber constructor.
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForPost', EventPriorities::PRE_WRITE]
        ];
    }

    public function setUserForPost(ViewEvent $event)
    {
        $post = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();


        if ($post instanceof Post && $method === 'POST') {
            /** @var User $user */
            $user = $this->security->getUser();
            $post->setUser($user);
        }

    }
}
