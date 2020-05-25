<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;

use App\Entity\User;
use App\Email\Mailer;
use App\Security\TokenGenerator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserRegisterSubscriber implements EventSubscriberInterface
{

    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;
    /**
     * @var TokenGenerator
     */
    private $tokenGenerator;
    /**
     * @var Mailer
     */
    private $mailer;

    public function __construct(
        UserPasswordEncoderInterface $passwordEncoder,
        TokenGenerator $tokenGenerator,
        Mailer $mailer
    )
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->tokenGenerator = $tokenGenerator;
        $this->mailer = $mailer;
    }


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>
                ['userRegistered', EventPriorities::PRE_WRITE],
        ];
    }


    public function userRegistered(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()
            ->getMethod();

        if ($user instanceof User && $method === 'POST') {
            // It is an User, we need to hash password here
            $user->setPassword(
                $this->passwordEncoder->encodePassword($user, $user->getPassword())
            );
            // Create confirmation token
            $user->setConfirmationToken(
                $this->tokenGenerator->getRandomSecureToken()
            );
            // Send e-mail here...
        $this->mailer->sendConfirmationEmail($user);
        }
    }
}
