<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Invitation extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $eventURL;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $id)
    {
        $this->user = $user;
        $this->eventURL = 'https://jpbrite.herokuapp.com/display-event-' . $id;
    }
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('event@dab.be')->view('emails.invitation');
    }
}