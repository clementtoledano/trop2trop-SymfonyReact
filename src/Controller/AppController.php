<?php

namespace App\Controller;

use App\Security\UserConfirmationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="app")
     */
    public function index()
    {
        return $this->render('app/index.html.twig', []);
    }


    /**
     * @Route("/confirm-user/{token}", name="default_confirm_token")
     * @param string $token
     * @param UserConfirmationService $userConfirmationService
     * @return RedirectResponse
     */
    public function confirmUser(
        string $token,
        UserConfirmationService $userConfirmationService
    ): RedirectResponse
    {
        $userConfirmationService->confirmUser($token);

        return $this->redirectToRoute('app');
    }
}
