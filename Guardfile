# -= Guarded paths =-

PATHS = { :in => 'src', :out => './' }

# -= Guard preprocessors =-

group :templates do

  # Sample guardfile block for Guard::Haml
  # You can use some options to change guard-haml configuration
  # :run_at_start => true                 compile files when guard starts
  # :notifications => true                send notifictions to Growl/libnotify/Notifu
  # :haml_options => { :ugly => true }    pass options to the Haml engine

  guard 'slim', :input_root => PATHS[:in], :output_root => PATHS[:out], :slim => { :pretty => true } do
    watch(%r'^.+\.slim$')
  end
end

group :javascripts do
  guard 'coffeescript', :input => PATHS[:in] , :output => PATHS[:out]

  guard 'uglify', input: "jquery.phoenix.js", output: "jquery.phoenix.min.js" do
    watch (%r{jquery.phoenix.js})
  end
end

# -= Livereload =-
group :reload do
  guard 'livereload' do
    watch(%r{#{PATHS[:out]}/.+\.html$})
    watch(%r{#{PATHS[:out]}/stylesheets/.+\.css$})
    watch(%r{#{PATHS[:out]}/javascripts/.+\.js$})
  end
end
