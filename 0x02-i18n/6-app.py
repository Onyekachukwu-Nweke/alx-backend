#!/usr/bin/env python3
"""
Create a get_locale function with the babel.localeselector decorator.

Use request.accept_languages to determine the best match
with our supported languages..
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel, _

app = Flask(__name__)
babel = Babel(app)


class Config():
    """
    config class
    to keep track of languages available
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)


users = {
        1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
        2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
        3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
        4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"}
        }


def get_user():
    """
    get current user logging in
    """
    id = int(request.args.get('login_as'))
    try:
        if id:
            return users[id]
        return None
    except Exception:
        return None


@app.before_request
def before_request():
    """
    """
    try:
        g.user = get_user()
    except Exception:
        g.user = None


@babel.localeselector
def get_locale():
    """
     Get locale from request
    """
    locale = request.args.get('locale')
    if locale:
        return locale

    try:
        user = get_user()
        if user:
            lang = user.get('locale')
            if lang in app.config['LANGUAGES']:
                return lang
    except TypeError:
        user = None

    lang = request.headers.get('locale')
    if lang in app.config['LANGUAGES']:
        return lang

    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', methods=['GET'], strict_slashes=False)
def home():
    """
    renders template/index.html
    """
    return render_template('6-index.html')

# babel.init_app(app, locale_selector=get_locale)


if __name__ == "__main__":
    app.run(host='127.0.0.1', port='5000')
